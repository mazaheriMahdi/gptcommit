import { log } from "@clack/prompts";
import { Configuration, OpenAIApi } from "openai";
import { resolve } from "path";

export class GptCommit extends OpenAIApi {
  constructor(n : number  , key : string) {
    super(
      new Configuration({
        apiKey: key,
      })
    );
  }
  public async getCommitMessage(data: String): Promise<String[]> {
    let choices: String[] = [];
    try {
      const response = await this.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: ("Generate commit message for \n" + data) as string,
          },
        ],
        n: 3,
      }).then((res) => res.data);
      choices = await response.choices.map(
        (item) => item.message?.content as string
      );
    } catch (e) {
      choices = ["Connection Error"];
    }
    return choices;
  }
}
