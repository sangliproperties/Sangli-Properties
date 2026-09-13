import { Suspense } from "react";
import ResidentialFiltersClient from "./ResidentialFiltersClient";

export default function ResidentialFilters(
    props: React.ComponentProps<typeof ResidentialFiltersClient>,
) {
    return (
        <Suspense>
            <ResidentialFiltersClient {...props} />
        </Suspense>
    );
}
