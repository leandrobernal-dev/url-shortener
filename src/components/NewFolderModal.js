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

export default function NewFolderModalForm({
    open,
    setOpen,
    handleSubmit,
    loading,
}) {
    return (
        <Modal open={open} onClose={() => setOpen((prevState) => !prevState)}>
            <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                aria-describedby="basic-modal-dialog-description"
                sx={{ maxWidth: 500 }}
            >
                <Typography id="basic-modal-dialog-title" component="h2">
                    Create New Folder
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input autoFocus name="name" required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Input name="description" required />
                        </FormControl>

                        <Button
                            loading={loading}
                            variant="outlined"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
}
