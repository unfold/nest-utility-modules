import { Injectable } from '@nestjs/common'

@Injectable()
export class NodeIdParser {
  encodeNodeId(nodeId: string, isProduction: boolean): string {
    const encoding = isProduction ? 'base64' : 'utf8'

    return Buffer.from(nodeId, 'utf8').toString(encoding)
  }

  decodeNodeId(nodeId: string, isProduction: boolean): string {
    if (isProduction) {
      const [, ...id] = Buffer.from(nodeId, 'base64').toString('utf8').split(':')

      return id.join(':')
    }

    return nodeId
  }
}
