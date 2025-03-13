"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const fs = require("fs");
async function bootstrap() {
    const httpsOptions = {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT),
        passphrase: process.env.SSL_PASS
    };
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        httpsOptions
    });
    app.enableCors({
        origin: ["http://localhost:5173", "https://localhost:5173", /192\.168\.1\.\d+/],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map