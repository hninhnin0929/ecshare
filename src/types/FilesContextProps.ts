import { mutate } from "swr";
import { FileProps } from "./FileProps";

export interface FilesContextProps {
    files: FileProps[];
    setFiles: (files: FileProps[]) => void;
    mutate: typeof mutate;
}
