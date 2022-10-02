import {Module} from '@nestjs/common';
import {FeedbackTypeController} from '../../controllers';
import {TypeOrmExModule} from '../global';
import {FeedbackTypeService} from '../../services';
import {FeedbackTypeRepository} from '../../repositories';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([FeedbackTypeRepository]),
  ],
  providers: [FeedbackTypeService],
  exports: [FeedbackTypeService],
  controllers: [FeedbackTypeController],
})
export class FeedbackTypeModule {
}
