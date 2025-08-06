import SudokuLoading from './SudokuLoading';

export default function PageLoading() {
    return (
        <SudokuLoading
            message="Loading..."
            size="md"
            fullScreen={true}
        />
    );
}