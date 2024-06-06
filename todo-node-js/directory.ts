import { User, Todo } from "./interfaces";
import {
  DirectoryV3 as DirectoryClient,
  DirectoryV3Config,
  DirectoryServiceV3,
} from "@aserto/aserto-node";

export class Directory {
  client: DirectoryClient;

  constructor(config: DirectoryV3Config) {
    const url = config.url ?? process.env.ASERTO_DIRECTORY_SERVICE_URL;
    const tenantId = config.tenantId ?? process.env.ASERTO_TENANT_ID;
    const apiKey = config.apiKey ?? process.env.ASERTO_DIRECTORY_API_KEY;
    let rejectUnauthorized = config.rejectUnauthorized
    const caFile = config.caFile ?? process.env.ASERTO_DIRECTORY_CERT_PATH

    if (rejectUnauthorized === undefined) {
      rejectUnauthorized = process.env.ASERTO_DIRECTORY_REJECT_UNAUTHORIZED === "true"
    }

    this.client = DirectoryServiceV3({
      url,
      tenantId,
      apiKey,
      rejectUnauthorized,
      caFile: caFile,
    });
  }

  async getUserByIdentity(identity: string): Promise<User> {
    const relation = await this.client.relation({
      subjectType: 'user',
      objectType: 'identity',
      objectId: identity,
      relation: 'identifier',
    });
    
    if (!relation || !relation.result) {
      throw new Error(`No relations found for identity ${identity}`, )
    }

    const user = await this.client.object({
      objectId: relation.result.subjectId,
      objectType: relation.result.subjectType,
    });
    const { email, picture, roles } = JSON.parse(user.properties.toJsonString());
    return {
      id: user.id,
      name: user.displayName,
      email,
      picture,
      roles,
    };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.client.object({objectId: id, objectType: 'user'});
    const { email, picture, roles } = JSON.parse(user.properties.toJsonString());
    return {
      id: user.id,
      name: user.displayName,
      email,
      picture,
      roles,
    };
  }

  async insertTodo(todo: Todo) {
    try {
      await this.client.setObject({
        object: {
          id: todo.ID,
          type: 'resource',
          displayName: todo.Title
        }
      });
      await this.client.setRelation({
        relation: {
          subjectId: todo.OwnerID,
          subjectType: 'user',
          objectId: todo.ID,
          objectType: 'resource',
          relation: 'owner'
        }
      });
    } catch (e) {
      console.error(e)
    }
  }

  async deleteTodo(todoId: string) {
    try {
      await this.client.deleteObject({
        objectId: todoId,
        objectType: 'resource',
        withRelations: true
      });
    } catch (e) {
      console.error(e)
    }
  }
}
