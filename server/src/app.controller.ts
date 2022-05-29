import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post("/refresh_token")
  async sendRefreshToken(@Req() req, @Res() res) {
    const token = req.cookies.jid;
    return res.json(await this.appService.refreshToken(token, res));
  }
}
