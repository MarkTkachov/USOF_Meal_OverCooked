import { Grid } from "@mui/material";
import CategoryCard from "./CategoryCard";


export default function CategoryGrid({ categories }) {
    return (
        <Grid container spacing={3} margin={'1em'}>
            {categories.map(cat => <Grid key={cat.id} item md={3} sm={6}><CategoryCard category={cat} /></Grid>)}
        </Grid>
    );
}
