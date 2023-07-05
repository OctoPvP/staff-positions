import React from 'react';

const ClientSide = ({ children }: {children: React.ReactNode | React.ReactNode[]}) => {
    const [show, setShow] = React.useState(false);
    React.useEffect(() => {
        setShow(true);
    }, []);
    return (
        <>
            {show && children}
        </>
    );
};

export default ClientSide;