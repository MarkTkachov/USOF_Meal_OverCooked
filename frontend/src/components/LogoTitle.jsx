import { ButtonBase, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


export default function LogoTitle({ active , text='Meal OverCooked'}) {
    const navigate = useNavigate();
    if (active) {
        return (
            <div>
                <ButtonBase color='inherit' onClick={() => navigate('/')}>
                    <img src="/mealOverCookedLogo.svg" alt="Logo" style={{ padding: '0.5em', height: '3em' }} />
                    <Typography variant="h4" noWrap position={'relative'} top={'0.1em'} paddingRight={'1em'} fontFamily={"Kaushan Script"} >
                        {text}
                    </Typography>
                </ButtonBase>
            </div>
        );
    }
    else return (
        <div>
            <img src="/mealOverCookedLogo.svg" alt="Logo" style={{ padding: '0.5em', height: '3em' }} />
            <Typography variant="h4" noWrap position={'relative'} top={'0.1em'} paddingRight={'1em'} fontFamily={"Kaushan Script"} >
                {text}
            </Typography>
        </div>
    );
}
