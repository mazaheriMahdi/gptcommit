import { CONFIG_NOT_FOUND } from "../messages/messages";

export class ConfigNotFound extends Error {
  constructor() {
    super(CONFIG_NOT_FOUND);
  }
}