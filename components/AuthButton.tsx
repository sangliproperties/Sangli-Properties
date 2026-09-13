import { Suspense } from "react";
import AuthButtonClient from "./AuthButtonClient";

export default function AuthButton(props: {
    mobile?: boolean;
    showButton?: boolean;
}) {
    return (
        <Suspense>
            <AuthButtonClient {...props} />
        </Suspense>
    );
}
