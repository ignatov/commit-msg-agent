The message has no diff. The changes are in the git repository in the current directory, and they are not committed yet. Look at them with the tools:
- Run the git command from the message to see the diff. For a large change, start with the files that changed the most, and stop when you know what the change does.
- Read other files only when the diff does not explain the change.
- Do not change files, the index, or the history.
- Do not explain what you found. When you know the change, write the commit message between <commit_message> and </commit_message>. The text outside the tags is ignored.
