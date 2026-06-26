import CategoryForm from "../../components/CategoryForm";
import { useParams } from "react-router-dom";

export default function EditCategory() {
    const id = useParams().id;

    return(
    <CategoryForm mode = "edit" categoryId = {id} />
    )
}