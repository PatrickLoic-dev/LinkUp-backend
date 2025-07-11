// src/common/logging/logger.service.ts
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly baseLogDir = path.resolve(__dirname, '../../../logs');
  private readonly retentionDays = 90;
  private readonly levels = ['log', 'error', 'warn', 'debug', 'verbose'];

  constructor() {
    this.ensureLogStructure();
    this.cleanupOldLogs();
  }

  // 📂 Crée les dossiers log/error/warn...
  private ensureLogStructure() {
    if (!fs.existsSync(this.baseLogDir)) {
      fs.mkdirSync(this.baseLogDir, { recursive: true });
    }

    this.levels.forEach(level => {
      const levelDir = path.join(this.baseLogDir, level);
      if (!fs.existsSync(levelDir)) {
        fs.mkdirSync(levelDir);
      }
    });
  }

  // 🗃️ Crée le chemin du fichier pour chaque type de log
  private getLogFilePath(level: string): string {
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const levelDir = path.join(this.baseLogDir, level);
    return path.join(levelDir, `${date}.log`);
  }

  // ✍️ Écrit dans le fichier approprié
  private writeToFile(level: string, message: string) {
    const filePath = this.getLogFilePath(level);
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
    fs.appendFileSync(filePath, formatted, { encoding: 'utf8' });
  }

  // 🧹 Supprime les fichiers trop anciens
  private cleanupOldLogs() {
    const now = new Date();

    this.levels.forEach(level => {
      const dirPath = path.join(this.baseLogDir, level);

      if (!fs.existsSync(dirPath)) return;

      fs.readdirSync(dirPath).forEach(file => {
        const match = file.match(/^(\d{4}-\d{2}-\d{2})\.log$/);
        if (match) {
          const fileDate = new Date(match[1]);
          const diffDays = (now.getTime() - fileDate.getTime()) / (1000 * 60 * 60 * 24);

          if (diffDays > this.retentionDays) {
            fs.unlinkSync(path.join(dirPath, file));
          }
        }
      });
    });
  }

  // 🟢 Implémentation des méthodes Nest
  log(message: string) {
    this.writeToFile('log', message);
  }

  error(message: string, trace?: string) {
    this.writeToFile('error', `${message}${trace ? `\nTrace: ${trace}` : ''}`);
  }

  warn(message: string) {
    this.writeToFile('warn', message);
  }

  debug(message: string) {
    this.writeToFile('debug', message);
  }

  verbose(message: string) {
    this.writeToFile('verbose', message);
  }
}
