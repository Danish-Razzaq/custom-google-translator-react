import React, { useEffect, useRef, useState } from 'react';
import { IoLanguageSharp } from 'react-icons/io5';

const LanguageSelector = () => {
    const scriptRef = useRef();
    const translateRef = useRef();
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        let timeoutId;

        function initTranslate() {
            if (!scriptRef.current) {
                const addScript = document.createElement('script');
                addScript.setAttribute('type', 'text/javascript');
                addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
                scriptRef.current = addScript;
                document.body.appendChild(addScript);
            }

            const style = document.createElement('style');
            style.textContent = `
        .goog-te-gadget {
          font-family: inherit !important;
        }
        .goog-te-gadget img {
          display: none !important;
        }
        .goog-te-gadget > span {
          display: none !important;
        }
        .goog-te-combo {
          opacity: 0 !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          cursor: pointer !important;
        }
        body {
          top: 0 !important;
        }
        .VIpgJd-ZVi9od-ORHb-OEVmcd { display: none !important; }
        .VIpgJd-ZVi9od-l4eHX-hSRGPd { display: none !important; }
        .goog-te-banner-frame { display: none !important; }
      `;
            document.head.appendChild(style);

            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'en,es,fr,de,hi,zh-CN,ja,ko,ar',
                        autoDisplay: false,
                    },
                    'google_translate_element'
                );

                // Monitor for language changes
                const observer = new MutationObserver(() => {
                    const select = document.querySelector('.goog-te-combo');
                    if (select) {
                        select.addEventListener('change', (e) => {
                            const selectedText = e.target.options[e.target.selectedIndex].text;
                            setSelectedLanguage(selectedText);
                            setIsOpen(false);
                        });
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });
            };
        }

        initTranslate();

        return () => clearTimeout(timeoutId);
    }, []);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'zh-CN', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'ar', name: 'Arabic' },
        //Add more languages here
    ];

    const handleLanguageSelect = (language) => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            select.value = language.code;
            select.dispatchEvent(new Event('change'));
        }
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <div className="flex cursor-pointer items-center gap-2 max-lg:flex-row-reverse" onClick={() => setIsOpen(!isOpen)}>
                <IoLanguageSharp className="h-6 w-6" />
                {selectedLanguage && <span className="ml-2 text-sm font-medium">{selectedLanguage}</span>}
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-44 rounded-md bg-white shadow-lg">
                    <div className="py-1">
                        {languages.map((language) => (
                            <div key={language.code} className=" cursor-pointer px-4 py-2 text-sm text-gray-700  hover:bg-gray-100" onClick={() => handleLanguageSelect(language)}>
                                {language.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div id="google_translate_element" ref={translateRef} className="pointer-events-none absolute opacity-0" />
        </div>
    );
};

export default LanguageSelector;
