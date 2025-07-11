import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { PostsModule } from './modules/posts/posts.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
  imports: [AuthenticationModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
