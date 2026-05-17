import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackService } from "./feedback.service";
type RequestWithUser = {
    user?: {
        id: string;
    };
};
export declare class FeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: FeedbackService);
    create(dto: CreateFeedbackDto, req: RequestWithUser): Promise<{
        id: string;
        message: string;
    }>;
}
export {};
