# AI Prompt Logging

## 📝 AI Usage Summary

- **Did AI help you solve any problems? If so, how?** Yes, AI was used to assist in the code tasks. It is tool much like google, Slack overflow or medium. We should use all the tools we can, as long it speeds us up.
- **What parts were 100% human-driven?** None, even though I wrote the solutions out myself. I did use Google and Grok as search engines to double-check some of the things I was writing. I tend to use Grok, Claude, and ChatGPT (depending on the query) as tools all day. These tools have replaced most of my "Googling." I tend to ask Grok if I have a question or thought and need to access their deep search. Grok for me is like Google on steroids, so it is a great tool. If I have a technical code question, I tend to use Claude. Occasionally I use ChatGPT instead of Grok, but I am finding at the moment, Grok is citing better resources—but it is good to check, as the AI battle changes on a month-to-month basis.
- **Did AI generate incorrect/misleading answers? How did you correct them?** Absolutely. The art of using GenAI is in the prompt, much like the art of using Google is in the question. I use AI as a tool; I try to use it as a way to assist the knowledge I already have. For new topics, I still like to go read documentation, read Medium, or check out a YouTube tech talk on the topic.
- **Which AI-powered IDE tools did you use? (e.g., GitHub Copilot, Cursor, ChatGPT in VS Code, etc.)** Curor with Claude-3.7-sonnet

---

## 📜 AI Prompts Used

Task 1
Prompt 1. @data-processor.js Create a new file names users.json and this data
Prompt 2. In this js file @data-processor.js we need to sort through the data in users.json. While sorting through this data we have 2 requirements. 1st requirement remove duplicate email, so therefore a email address can only be used once. 2nd requirement use the function fetchUserData to get a email addresses that are missing from the data in user.json. Right now function fetchUserData should not be changed, it is currently missing the API connection code, this will be added in later.
Prompt 3. We are still not making changes to function fetchUserData. We need to improve function processUsers, if possible. This needs to be as efficient as possible. We are expecting the user.json file to grow to 1million users and records.

Task 2
Prompt 1. @rate-limiter.js This js function looks after rate limiting for our SaaS product. Our product is multi tenant. Is this file we need to capture each tenants id when this function is called so that we can return a status 429 if a single tennant reaches the limit of 100 requests per 60 seconds. So next steps are to implement a middleware to limit API requests per tenant

Task 3
Prompt 1. @drag-drop.vue This vue file is an from our frontend our users are using. We want to give them the ability to add UI components to a web page preview. This will an interactive drag and drop solution for the users.

Task 4
Prompt 1. Update this terraform file @infra.tf to allow to deploy an ECS Fargate cluster with a load balancer.
