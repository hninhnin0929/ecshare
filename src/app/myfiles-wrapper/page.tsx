import { FilesProvider } from "@/context/filesContext";
import MyFiles from "../myfiles/page";

export default function MyFilesWrapper() {

    return (
        <FilesProvider>
            <MyFiles />
        </FilesProvider>

    );
  }