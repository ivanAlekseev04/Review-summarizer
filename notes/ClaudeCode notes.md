# Claude & Claude Code — Notes

A structured reference covering Claude Code commands, prompting, context management, MCP, skills, checkpointing, and subagents.

---

## ⚠️ Important Notes

These are the cross-cutting rules and gotchas worth keeping front of mind.

- **`CLAUDE.md` is the essential context file.** It is _always_ part of the context window, so it should be kept **lean** — only the context that genuinely needs to be present on every request.
- **Claude Code tracks open files.** Because it already knows which files are open, you sometimes don't need to mention them explicitly as context for a prompt.
- **Claude Code tracks your IDE selection.** The currently selected code in VS Code is available to Claude. You can select a line and prompt directly about it, e.g. _"explain this line to me."_
- **Build patterns with small tasks first.** Like other agents, Claude is good at sticking to established patterns. Start small so it learns the pattern, then grow the task — it will follow the pattern from there. Jumping straight into a large task risks Claude going off the rails and mixing inconsistent patterns.
- **Clear the context window when switching tasks.** Use `/clear` between unrelated tasks. When working on several tasks at once, use `/compact` instead to compress rather than discard.
- **Context window size directly affects usage and cost.** Managing the context window is how you control spend. Every request pulls in the context from `CLAUDE.md`, so keep that file precise and up to date with the project's current structure.
- **Claude has a knowledge cutoff.** Like any model, its training data ends at a certain date, so the very latest information or news may be unavailable, and some suggestions can be outdated. Tools like web search and Context7 help bridge this gap.
- **Skills ≠ MCP servers.** _MCP_ gives Claude access to external services; _Skills_ are instructions that teach Claude **how** to do things.
- **`Skillsmp` is a useful remote skills repository** worth knowing about as a source of ready-made skills.

---

## Claude Code Commands

Slash commands run **inside** an interactive Claude Code session — type `/` to see what your build exposes. The last two entries below (`claude` and `claude --resume`) are _CLI invocations_ you run from your shell, not in-session slash commands.

| Command           | Description                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `/model`          | Switch the active model for the session (e.g. Opus, Sonnet, Haiku) to trade off capability, speed, and cost.                             |
| `/usage`          | Show your current plan usage and rate-limit status, so you can see how much of your allowance is left.                                   |
| `/terminal-setup` | Configure terminal key bindings (for example, enabling `Shift+Enter` for newlines) so the editor behaves correctly in your terminal/IDE. |
| `/tasks`          | View and manage background tasks and running agents launched during the session.                                                         |
| `/init`           | Analyze the current repository and generate a `CLAUDE.md` memory file describing the project.                                            |
| `/context`        | Visualize how the context window is currently being used, broken down by category (see _Context Usage_ below).                           |
| `/clear`          | Reset the conversation and clear the context window. Use it when switching to an unrelated task.                                         |
| `/compact`        | Compress the conversation history into a summary to free up context while keeping key information.                                       |
| `/exit`           | End the current Claude Code session and return to the shell.                                                                             |
| `/skills`         | List and manage the skills registered for the session.                                                                                   |
| `/rewind`         | Restore the code and/or conversation to an earlier checkpoint (see _Checkpointing_ below).                                               |
| `/agents`         | Create, view, and manage subagents (separate Claude instances with their own context).                                                   |
| `claude`          | **(CLI)** Start an interactive Claude Code session in the current directory.                                                             |
| `claude --resume` | **(CLI)** Resume a previous session, restoring its prior conversation context.                                                           |

---

## Prompting Advice

- **Be clear and specific.** ❌ _"Give token"_ → ✅ _"Give me JWT token information in detail."_
- **Give context.** State what Claude should take into consideration.
- **Be concise.** Trim filler; say exactly what you need.
- **Skip the emotional / "friendly" filler.** Polite padding adds tokens without improving the result.

---

## Exploring a Project's Structure

Good opening questions when getting oriented in an unfamiliar codebase:

- What does this project do?
- What tech stack does it use?
- How is authentication implemented?
- Explain the folder structure.

---

## Claude Code Best Practices

- Once you've changed the project's structure or architecture, update that structure in `CLAUDE.md` as well so the memory file stays in sync with reality.

---

## Planning Mode

Plan Mode lets Claude analyze the task and propose an approach **before** it makes any edits. It is effectively a read-only mode: Claude inspects the code and lays out a step-by-step plan, which you review and approve before any changes are written. This is valuable for larger or riskier changes, where you want to align on the approach before committing Claude to edits.

- **What is "context" here?** The plan and the analysis Claude produces become part of the conversation context. That context (the agreed approach, the files inspected, the constraints discussed) is what guides the subsequent implementation.
- **When to avoid clearing context after accepting changes.** If the work you're about to do depends on the plan and reasoning just established, **don't** `/clear` right after accepting — clearing would discard the very context (the agreed plan and decisions) the implementation relies on. Only clear once you've genuinely moved on to an unrelated task.

---

## Context Window

The context window is Claude's **working memory** — the information it can read at once. It includes:

- The `CLAUDE.md` memory files
- The conversation history
- The files and directories currently loaded into context

---

## Tokens

A token is a chunk of text — typically about _⅓ of a word_, or a single punctuation mark (`,`, `!`, `?`). Models read and bill in tokens, not words, which is why context size maps directly onto cost.

---

## Context Usage

When you run `/context`, the window is broken down into the categories below. Watching these is how you keep requests cheap and focused.

| Category               | What it is                                                                                       | Example                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **System prompt**      | The base instructions that define how Claude Code behaves. Always present.                       | The built-in guidance telling Claude how to use its tools and format responses.                       |
| **System tools**       | The definitions/schemas of the built-in tools Claude can call.                                   | The descriptions of `Read`, `Edit`, `Bash`, etc., that let Claude know what each tool does.           |
| **Memory files**       | The `CLAUDE.md` files (project-level and global) loaded into context.                            | A project `CLAUDE.md` describing the tech stack, conventions, and folder layout.                      |
| **Skills**             | The descriptions of all registered skills, loaded at startup.                                    | The one-line description of a "deploy checklist" skill, ready to be invoked when relevant.            |
| **Messages**           | The running conversation — your prompts, Claude's replies, and tool results.                     | Your last 10 prompts plus the file contents and command output Claude has read.                       |
| **Free space**         | The remaining unused portion of the window, available for new work.                              | The headroom left for reading more files or holding a longer conversation.                            |
| **Autocompact buffer** | A reserved slice kept aside so auto-compaction can kick in _before_ the window fills completely. | The cushion that triggers an automatic `/compact` as you approach the limit, instead of hard-failing. |

---

## Model Context Protocol (MCP)

MCP lets Claude use additional tools — Postgres, Slack, Jira, GitHub, and more — so it can cooperate with those services directly (for example, running PostgreSQL queries).

**Why a standard matters.** Without MCP — a standardized way to talk to services — every provider (Anthropic, OpenAI, etc.) would have to write its own integration for each service like Jira. That would bloat each codebase with per-service scripts, restrict new integrations to whoever maintains them, and force _every_ provider to rewrite its code whenever a service's API changed.

**Structure:**

```text
MCP client  →  MCP server  →  service (e.g. GitHub)
```

- **MCP server:** knows exactly how to talk to the service — the formats it expects and what operations are possible. If the service's API changes, **only the server** changes.
- **MCP client:** the AI-provider-specific way of talking to the MCP server.

**Use MCP servers only when you actually need them.** Each server exposes its own tools, and each tool's documentation is loaded into the request's context window — so unused servers are just context (and cost) overhead.

**Remote vs. local servers:**

- **Remote:** on startup, Claude asks the remote server which tools it offers; once it knows them, it fetches each tool's documentation as needed.
- **Local:** runs as a separate process on your machine. Claude communicates with it via **stdin** (standard input) and **stdout** (standard output); the local MCP, in turn, talks to the remote MCP over HTTP to fetch up-to-date docs.

### MCP Servers to Install

- **Context7** — fetches up-to-date, version-specific documentation and injects it directly into the prompt. It pulls docs from the web and gives Claude access to them, so: _no more outdated examples, no more hallucinated implementations._

---

## Skills

Skills are **instructions that teach Claude how to do things**.

**Examples:**

1. **Pre-deploy steps.** If you want Claude to follow particular steps _before_ deploying the application, create a skill for that instead of writing the steps into the prompt every time.
2. **API documentation standards.** If your API docs must follow team policy/standards, write a skill so you don't re-explain the rules each time.
3. **Unit-test conventions.** If you want tests written with a specific library, following a naming convention and a particular file structure, capture that as a skill instead of repeating yourself.

**Golden rule:** _If you find yourself repeating the same instructions, package them as a skill._

**How skills load:** When Claude Code starts, it loads the **descriptions** of all registered skills into the context window. Later, when a skill is actually invoked, its **detailed instructions** get loaded. In other words, a skill is a way to add instructions to Claude _dynamically_ — instead of stuffing a long, detailed description of some action into `CLAUDE.md` (which is always in context), you create a skill that resolves on demand depending on the situation.

### Skills to Install

- **Frontend-design (by Anthropic)** — with the right instructions, it can significantly improve UI/UX output.

---

## Checkpointing

Every time Claude's file utilities change a file, a new snapshot is created. This works like a local Git — think of it as an **"undo" button for the entire project**.

**When it's useful:**

- When you're unhappy with Claude's changes and want to roll back.
- When Claude offers several approaches and you want to evaluate each one.

If you commit before each prompt, you're already covered. But when the code isn't ready to be committed, checkpointing fills the gap — or you can commit what you have, then amend that commit with whichever changes you end up preferring.

**Example — testing multiple options by rewinding:**
Suppose you ask Claude to implement caching and it proposes two approaches: (A) an in-memory cache and (B) Redis.

1. Let Claude implement **approach A**, then run it and evaluate the result.
2. If you want to compare, `/rewind` back to the checkpoint _before_ approach A was applied — restoring the project to its pre-change state.
3. Ask Claude to implement **approach B**, run it, and evaluate.
4. Compare the two, then `/rewind` once more to land on whichever approach you prefer and keep that one.

This lets you trial each option from the same clean starting point without manually undoing edits between attempts.

### Checkpointing — Limitations

1. **Session-scoped.** It only works within the same Claude Code session.
2. **Edit-tool-scoped.** It only tracks changes made by Claude's _file-editing tools_. If Claude runs a **Bash** command to remove or move a file, those changes are **not** tracked.

---

## Subagents

**Problem:** If you ask Claude to run the tests, the results, stack traces, and exceptions flood the main context window.

**Solution:** A separate Claude instance that runs the tests, processes the results, and reports back only a brief summary (e.g. _"38 of 40 tests passed"_) to the main instance. In most cases you only want the quick summary, not the full trace.

A **subagent** is a separate Claude instance with its own context window, tool set, and system prompt.

**Use cases** — tasks that produce a lot of output:

- Running tests
- Fetching documentation
- Processing log files
- Exploring a new codebase

**Idea:** Keep the main conversation clean and short by delegating noisy, computational work to subagents — like having specialists handle their part instead of one person doing everything.
