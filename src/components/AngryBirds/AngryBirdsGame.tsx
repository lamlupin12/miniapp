'use client';

import React from 'react';
import Script from 'next/script';

const AngryBirdsGame: React.FC = () => {
  return (
    <div id="content" style={{ width: '782px', height: '440px' }}>
      <Script src="/angrybirds/AngryBirdsGame.js" strategy="lazyOnload" />
    </div>
  );
};

export default AngryBirdsGame;
