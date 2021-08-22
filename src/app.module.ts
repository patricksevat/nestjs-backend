import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from './v1/v1.module';
import { RouterModule } from '@nestjs/core';

// const parent = module.parent;
// const parentFileName = parent?.filename;
// const IS_E2E_TEST = parentFileName.includes('e2e-spec.ts');

// const imports = [
//   RouterModule.register([
//     {
//       path: 'v1',
//       module: V1Module,
//     },
//   ]),
//   V1Module,
// ];

// if (!IS_E2E_TEST) {
// imports.push(
//   TypeOrmModule.forRoot({
//     type: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     username: 'root',
//     password: 'root',
//     database: 'didomi',
//     autoLoadEntities: true,
//     synchronize: true,
//   }),
// );
// }

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'didomi',
      autoLoadEntities: true,
      synchronize: true,
    }),
    RouterModule.register([
      {
        path: 'v1',
        module: V1Module,
      },
    ]),
    V1Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
