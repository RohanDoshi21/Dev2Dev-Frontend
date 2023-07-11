const formatCode = (description) => {
  if (!description) {
    return ""; // Return an empty string if description is undefined or null
  }

  // Regular expression to find code blocks
  const regex = /```([\s\S]*?)```/g;

  // Replace the code blocks with formatted code
  return description.replace(regex, (match, code) => {
    // Remove leading and trailing whitespace from the code block content
    const trimmedCode = code.trim();

    // Check if a language is specified
    if (trimmedCode !== "") {
      // Apply formatting to the code block
      return `<pre><code class="language-javascript">${trimmedCode}</code></pre>`;
    } else {
      // No language specified, return the code block as is
      return match;
    }
  });
};

export default formatCode;
