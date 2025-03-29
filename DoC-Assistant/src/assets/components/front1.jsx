import { useState } from 'react';
import axios from 'axios';
import copy from "./copy.svg";
import tick from "./tick.svg";

const Demo = () => {
  const [summary, setSummary] = useState('');
  const [qa, setQa] = useState([]); 
  const [file, setFile] = useState(null);
  const [copied, setCopied] = useState('');
  const [summaryLevel, setSummaryLevel] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSummarySubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIsDisabled(true); // Disable both buttons on submit

    const formData = new FormData();
    formData.append('file', file);
    formData.append('summary_type', summaryLevel);

    try {
      const response = await axios.post('http://localhost:5000/summary', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error uploading the file:', error);
    } finally {
      setIsLoading(false);
      setIsDisabled(false); // Re-enable both buttons after request completes
    }
  };

  const handleQaSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIsDisabled(true); // Disable both buttons on submit

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/qa', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setQa(response.data.qa || []);  
    } catch (error) {
      console.error('Error uploading the file:', error);
    } finally {
      setIsLoading(false);
      setIsDisabled(false); // Re-enable both buttons after request completes
    }
  };

  const handleCopy = (text) => {
    if (text) {
      setCopied(text);
      navigator.clipboard.writeText(text);
      setTimeout(() => setCopied(''), 3000); 
    }
  };

  return (
    <section className="mt-16 w-full max-w-xl mx-auto">
      <div className={`flex flex-col w-full gap-2 ${isDisabled ? 'pointer-events-none' : ''}`}>
        <form className="relative flex flex-col items-center gap-2" onSubmit={handleSummarySubmit}>
          <input
            type="file"
            onChange={handleFileChange}
            required
            className="file_input"
            disabled={isDisabled}
          />
          <div className="gap-container">
            <select
              value={summaryLevel}
              onChange={(e) => setSummaryLevel(e.target.value)}
              className="drop-down-menu"
              disabled={isDisabled}
            >
              <option value="small">Abstract</option>
              <option value="medium">Summary</option>
              <option value="large">Article</option>
            </select>
            <button
              type="submit"
              className="submit_btn"
              disabled={isDisabled}
            >
              Summarize
            </button>
            <button
              onClick={handleQaSubmit}
              className="submit_btn"
              disabled={isDisabled}
            >
              Generate Q&A
            </button>
          </div>
        </form>
      </div>

      {isLoading && <div className="loader"></div>}

      <div className="my-10 max-w-full flex justify-center items-center">
      {summary ? (
          <div className="flex flex-col gap-3">
            <h2 className="font-satoshi font-bold text-gray-600">
               <span className="blue_gradient">PDF Summary</span>
            </h2>
            <div className="summary_box font-inter font-medium text-sm">
              {/* Render HTML summary safely */}
              <div dangerouslySetInnerHTML={{ __html: summary }} />
            </div>
            <div className="copy_btn" onClick={() => handleCopy(summary)}>
              <img
                src={copied === summary ? tick : copy}
                alt="copy_icon"
                className="svg-copy"
              />
            </div>
          </div>
        ) : (
          <p>No summary available.</p>
        )}

      {qa.length > 0 ? (
          <div className="flex flex-col gap-3">
            <h2 className="font-satoshi font-bold text-gray-600">
               <span className="blue_gradient">PDF Q&A</span>
            </h2>
            <div className="summary_box font-inter font-medium text-sm">
              {/* Render HTML summary safely */}
              <div dangerouslySetInnerHTML={{ __html: qa }} />
            </div>
            <div className="copy_btn" onClick={() => handleCopy(qa)}>
              <img
                src={copied === qa ? tick : copy}
                alt="copy_icon"
                className="svg-copy"
              />
            </div>
          </div>
        ) : (
          <p>No Q&A available.</p>
        )}

      </div>
    </section>
  );
};

export default Demo;
