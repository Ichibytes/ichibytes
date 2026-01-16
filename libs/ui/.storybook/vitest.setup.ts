import { setProjectAnnotations } from "@storybook/react";
import * as previewAnnotations from "./preview";
import * as a11yAnnotations from "@storybook/addon-a11y/preview";

setProjectAnnotations([a11yAnnotations, previewAnnotations]);
