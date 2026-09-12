import { ProxyMiddleware } from './proxy.middleware';
import * as jwt from 'jsonwebtoken';
jest.mock('express-http-proxy',()=>jest.fn(()=>jest.fn((_req,_res,next)=>next())));
describe('Production assessor gateway routing',()=>{
 const previous=process.env.NODE_ENV;
 beforeAll(()=>{process.env.NODE_ENV='production';});
 afterAll(()=>{process.env.NODE_ENV=previous;});
 test.each([
  ['GET','/api/v1/assessment/questions/metadata/assessment-contexts','ASSESSOR',0],
  ['GET','/api/v1/assessment/questions/metadata/audience-types','ASSESSOR',0],
  ['POST','/api/v1/assessment/questions','ASSESSOR',0],
  ['PUT','/api/v1/assessment/questions/metadata/audience-types/id','ASSESSOR',403],
  ['POST','/api/v1/assessment/context-access/context','ASSESSOR',403],
  ['GET','/api/v1/assessment/questions','CANDIDATE',403],
  ['GET','/api/v1/assessment/questions','',401],
  ['POST','/api/v1/assessment/context-access/context','SUPER_ADMIN',0],
 ])('%s %s %s',(method,url,role,status)=>{
  const token=role?jwt.sign({sub:'user',session_id:'session',roles:[role]},process.env.AUTH_JWT_SECRET||'seek_jwt_secret_key_placeholder',{issuer:'seek.mn',audience:'seek.mn'}):'';
  const req:any={method,originalUrl:url,headers:{authorization:token?'Bearer '+token:undefined,'x-user-id':'spoof','x-user-roles':'SUPER_ADMIN'}};
  const res:any={status:jest.fn().mockReturnThis(),json:jest.fn()},next=jest.fn();
  new ProxyMiddleware().use(req,res,next);
  if(status)expect(res.status).toHaveBeenCalledWith(status);else {expect(res.status).not.toHaveBeenCalled();expect(next).toHaveBeenCalled();}
 });
});
