import { Box } from "@mui/material";
import '@mdxeditor/editor/style.css'
import { MDXEditor } from '@mdxeditor/editor/MDXEditor'
import { headingsPlugin } from '@mdxeditor/editor/plugins/headings'
import { listsPlugin } from '@mdxeditor/editor/plugins/lists'
import { quotePlugin } from '@mdxeditor/editor/plugins/quote'
import { imagePlugin } from '@mdxeditor/editor/plugins/image'
import { linkPlugin } from '@mdxeditor/editor/plugins/link'
import { linkDialogPlugin } from '@mdxeditor/editor/plugins/link-dialog'
import { thematicBreakPlugin } from '@mdxeditor/editor/plugins/thematic-break'
import { UndoRedo } from '@mdxeditor/editor/plugins/toolbar/components/UndoRedo'
import { BoldItalicUnderlineToggles } from '@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles'
import { toolbarPlugin } from '@mdxeditor/editor/plugins/toolbar'
import { BlockTypeSelect } from '@mdxeditor/editor/plugins/toolbar/components/BlockTypeSelect'
import { InsertImage } from '@mdxeditor/editor/plugins/toolbar/components/InsertImage'
import { InsertThematicBreak } from '@mdxeditor/editor/plugins/toolbar/components/InsertThematicBreak'
import { CreateLink } from '@mdxeditor/editor/plugins/toolbar/components/CreateLink'
import { ListsToggle } from '@mdxeditor/editor/plugins/toolbar/components/ListsToggle'
import axios from 'axios'

export default function MarkdownEditor({ value, onChange }) {

    async function imageUploadHandler(image) {
        const formData = new FormData()
        formData.append('image', image)
        // send the file to your server and return 
        // the URL of the uploaded image in the response
        const response = await axios.post('/api/files/image/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data.link;
      }

      
    return (
        <Box border={'1px solid gray'} borderRadius={'5px'}>
            <MDXEditor markdown={value || ''} onChange={onChange} 
                plugins={[headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                imagePlugin({ imageUploadHandler }),
                linkPlugin(),
                linkDialogPlugin(),
                toolbarPlugin({
                    toolbarContents: () => (<>
                        <UndoRedo />
                        <BlockTypeSelect />
                        <BoldItalicUnderlineToggles />
                        <ListsToggle />
                        <InsertThematicBreak />
                        <CreateLink />
                        <InsertImage />
                    </>)

                })]}
            />
        </Box>
    );
}
