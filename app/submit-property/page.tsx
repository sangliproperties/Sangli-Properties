import { Suspense } from "react";
import SubmitPropertyForm from "./SubmitPropertyForm";

export default function SubmitPropertyPage() {
    return (
        <Suspense>
            <SubmitPropertyForm />
        </Suspense>
    );
}
