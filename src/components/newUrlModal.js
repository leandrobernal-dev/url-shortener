import {
    Button,
    FormControl,
    FormLabel,
    Modal,
    ModalDialog,
    Stack,
    Typography,
    Input,
} from "@mui/joy";

export default function NewUrlModalForm({ open, setOpen, handleSubmit }) {
    return (
        <Modal open={open} onClose={() => setOpen((prevState) => !prevState)}>
            <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                aria-describedby="basic-modal-dialog-description"
                sx={{ maxWidth: 500 }}
            >
                <Typography id="basic-modal-dialog-title" component="h2">
                    Create new project
                </Typography>
                <Typography
                    id="basic-modal-dialog-description"
                    textColor="text.tertiary"
                >
                    Fill in the information of the project.
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>URL</FormLabel>
                            <Input autoFocus name="url" type="url" required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input name="name" required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Input name="description" required />
                        </FormControl>

                        <Button variant="outlined" type="submit">
                            Submit
                        </Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
}
