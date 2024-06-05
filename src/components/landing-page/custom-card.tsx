import React, { ComponentProps, FC } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { cn } from "@/lib/utils";

type CardProps = ComponentProps<typeof Card>;
type CustomCardProps = CardProps & {
    cardHeader?: React.ReactNode;
    cardFooter?: React.ReactNode;
    cardContent?: React.ReactNode;
};

const CustomCard: FC<CustomCardProps> = ({
    className,
    cardHeader,
    cardFooter,
    cardContent,
    ...props
}) => {
    return (
        <Card className={cn("w-[380px]", className)} {...props}>
            <CardHeader>{cardHeader}</CardHeader>
            <CardContent>{cardContent}</CardContent>
            <CardFooter>{cardFooter}</CardFooter>
        </Card>
    );
};

export default CustomCard;
