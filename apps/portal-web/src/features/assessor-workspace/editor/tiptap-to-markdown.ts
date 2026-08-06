import type { Editor } from '@tiptap/react';
import type { Node as PMNode } from '@tiptap/pm/model';

// Converts inline nodes (text with marks, inlineMath, image) inside a block node
function serializeInlines(node: PMNode): string {
  const parts: string[] = [];
  node.forEach((child) => {
    if (child.isText) {
      let text = child.text ?? '';
      // Marks applied innermost-first (reverse order)
      const marks = [...child.marks];
      for (const mark of marks) {
        switch (mark.type.name) {
          case 'bold':        text = `**${text}**`;        break;
          case 'italic':      text = `*${text}*`;          break;
          case 'strike':      text = `~~${text}~~`;        break;
          case 'underline':   text = `<u>${text}</u>`;     break;
          case 'superscript': text = `<sup>${text}</sup>`; break;
          case 'subscript':   text = `<sub>${text}</sub>`; break;
        }
      }
      parts.push(text);
    } else if (child.type.name === 'inlineMath') {
      parts.push(`$${String(child.attrs['latex'] ?? '')}$`);
    } else if (child.type.name === 'image') {
      const alt = String(child.attrs['alt'] ?? '');
      const src = String(child.attrs['src'] ?? '');
      parts.push(`![${alt}](${src})`);
    }
  });
  return parts.join('');
}

// Converts a block-level node (and nested blocks) to markdown
function serializeNode(node: PMNode, listDepth = 0): string {
  switch (node.type.name) {
    case 'paragraph':
      return serializeInlines(node);

    case 'heading': {
      const level = (node.attrs['level'] as number | undefined) ?? 1;
      return `${'#'.repeat(level)} ${serializeInlines(node)}`;
    }

    case 'bulletList': {
      const lines: string[] = [];
      node.forEach((item) => {
        const prefix = `${'  '.repeat(listDepth)}- `;
        lines.push(prefix + serializeNode(item, listDepth + 1));
      });
      return lines.join('\n');
    }

    case 'orderedList': {
      const lines: string[] = [];
      node.forEach((item, _offset, idx) => {
        const prefix = `${'  '.repeat(listDepth)}${idx + 1}. `;
        lines.push(prefix + serializeNode(item, listDepth + 1));
      });
      return lines.join('\n');
    }

    case 'listItem': {
      const childBlocks: string[] = [];
      node.forEach((child) => {
        childBlocks.push(serializeNode(child, listDepth));
      });
      return childBlocks.join('\n');
    }

    case 'table': {
      const lines: string[] = [];
      let firstRow = true;
      node.forEach((row) => {
        const cells: string[] = [];
        row.forEach((cell) => {
          const parts: string[] = [];
          cell.forEach((block) => {
            if (block.type.name === 'paragraph') parts.push(serializeInlines(block));
          });
          cells.push(parts.join(' ').replace(/\|/g, '\\|'));
        });
        lines.push('| ' + cells.join(' | ') + ' |');
        if (firstRow) {
          lines.push('| ' + cells.map(() => '---').join(' | ') + ' |');
          firstRow = false;
        }
      });
      return lines.join('\n');
    }

    case 'blockMath':
      return `$$\n${String(node.attrs['latex'] ?? '')}\n$$`;

    case 'image': {
      const alt = String(node.attrs['alt'] ?? '');
      const src = String(node.attrs['src'] ?? '');
      return `![${alt}](${src})`;
    }

    default: {
      const childBlocks: string[] = [];
      node.forEach((child) => {
        childBlocks.push(serializeNode(child, listDepth));
      });
      return childBlocks.join('\n');
    }
  }
}

export function tiptapDocToMarkdown(editorOrNode: Editor | PMNode): string {
  const node = 'state' in editorOrNode ? editorOrNode.state.doc : editorOrNode;
  const blocks: string[] = [];
  node.forEach((child) => {
    blocks.push(serializeNode(child));
  });
  return blocks.join('\n\n');
}
