import React, { FC, PropsWithChildren } from "react";

interface TemplateProps extends PropsWithChildren {}

const Template: FC<TemplateProps> = ({ children }) => {
    return <div className="flex h-screen justify-center p-6">{children}</div>;
};

export default Template;
