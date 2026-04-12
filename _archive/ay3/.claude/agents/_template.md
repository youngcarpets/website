# Agent: {Name}

> **Domain**: {one-line description}
> **Index**: `.claude/agents/indexes/{name}.index.md`
> **Mode**: Quick | Deep | Both

## Trigger Conditions
When to spawn this agent:
- {condition 1}
- {condition 2}

## Resources to Load
Read these files before starting work:
1. `.claude/agents/indexes/{name}.index.md` (agent's own index)
2. {specific resource files}
3. {specific reference files}

## Responsibilities
- {what this agent does}
- {what this agent does NOT do}

## Online Research Protocol
When the user says "search this online" or the agent needs external info:
1. Use WebSearch/WebFetch to find information
2. Validate the information against existing resources
3. Hand results to the Resource Merger agent with:
   - Target resource file path
   - New content to merge
   - Source URL

## Output Protocol
- {what the agent returns when done}
- {format of results}
