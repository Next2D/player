export * from "./TextField";
export * from "./TextFormat";
export {
    $textArea,
    $getSelectedTextField,
    $setSelectedTextField,
    $mainCanvasPosition
} from "./TextUtil";

import { $textArea } from "./TextUtil";
import { execute as textAreaRegisterEventUseCase } from "./TextArea/usecase/TextAreaRegisterEventUseCase";
textAreaRegisterEventUseCase($textArea);