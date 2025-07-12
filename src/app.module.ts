import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { PostsModule } from './modules/posts/posts.module';


@Module({
  imports: [AuthenticationModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
