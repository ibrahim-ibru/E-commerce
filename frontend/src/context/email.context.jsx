// context.jsx
import React, { createContext, useContext, useState } from 'react';

// Capitalize context name consistently
const EmailContext = createContext();

export const useEmailContext = () => {
  return useContext(EmailContext);
};

export const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState('');

  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      {children} {/* Make sure to render the children */}
    </EmailContext.Provider>
  );
};
