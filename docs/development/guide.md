

auth -ийн seed хийх
```
docker exec seek-auth sh -c "cd /app/services/auth && NODE_ENV=development TS_NODE_COMPILER_OPTIONS='{\"module\":\"commonjs\"}' npx prisma db seed"
```


```
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile auth-test up --build
```

```
npx prisma migrate deploy
```

assessment-ийн seed хийх

```
docker compose exec assessment sh -c "cd /app/services/assessment && NODE_ENV=development TS_NODE_COMPILER_OPTIONS='{\"module\":\"commonjs\"}' npx ts-node prisma/seed.ts"
```



