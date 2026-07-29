# Better Markdown

Better Markdown is a small Next.js app for generating GitHub-friendly markdown visuals. It helps you build polished README layouts with:

- Image galleries rendered as SVG badges or markdown tables
- Custom widgets such as cards, info badges, and download badges
- A preview panel so you can see the final README output before you paste it
- A lightbox gallery for inspecting images at full size

Live site: [https://better-markdown-theta.vercel.app/](https://better-markdown-theta.vercel.app/)

## What You Can Make

### Image galleries

Paste a set of image URLs and choose a layout. The app can generate:

- A compact gallery badge for markdown
- A single SVG badge that renders multiple images in a grid, row, or column
- A native markdown table that links each thumbnail to a shared gallery page

Example output with badges:

```md
[![Better Gallery](https://better-markdown-theta.vercel.app/api/gallery?images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA%2CaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA%2CaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA%2CaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA&cols=4&aspect=original)](https://better-markdown-theta.vercel.app/gallery?images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA)
```

[![Better Gallery](https://better-markdown-theta.vercel.app/api/gallery?images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA%2CaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA%2CaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA%2CaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA&cols=4&aspect=original)](https://better-markdown-theta.vercel.app/gallery?images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA)


Output with tabels:

```md
|   |   |   |   |
| --- | --- | --- | --- |
| <a href="https://better-markdown-theta.vercel.app/gallery?images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA&index=0"><img src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80" width="380" alt="Image 1" /></a> | <a href="https://better-markdown-theta.vercel.app/gallery?images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA&index=1"><img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80" width="380" alt="Image 2" /></a> | <a href="https://better-markdown-theta.vercel.app/gallery?images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA&index=2"><img src="https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80" width="380" alt="Image 3" /></a> | <a href="https://better-markdown-theta.vercel.app/gallery?images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA&index=3"><img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" width="380" alt="Image 4" /></a> |
```

|   |   |   |   |
| --- | --- | --- | --- |
| <a href="https://better-markdown-theta.vercel.app/gallery?images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA&index=0"><img src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80" width="380" alt="Image 1" /></a> | <a href="https://better-markdown-theta.vercel.app/gallery?images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA&index=1"><img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80" width="380" alt="Image 2" /></a> | <a href="https://better-markdown-theta.vercel.app/gallery?images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA&index=2"><img src="https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80" width="380" alt="Image 3" /></a> | <a href="https://better-markdown-theta.vercel.app/gallery?images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA&index=3"><img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" width="380" alt="Image 4" /></a> |




Gallery badge example:

```md
[![Gallery highlight](https://better-markdown-theta.vercel.app/api/gallery?style=badge&title=Gallery+highlight&subtitle=Open+the+full+image+gallery+from+your+README.&height=160&images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA%2CaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA%2CaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA%2CaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA)](https://better-markdown-theta.vercel.app/gallery?images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA)
```
[![Gallery highlight](https://better-markdown-theta.vercel.app/api/gallery?style=badge&title=Gallery+highlight&subtitle=Open+the+full+image+gallery+from+your+README.&height=160&images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA%2CaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA%2CaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA%2CaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA)](https://better-markdown-theta.vercel.app/gallery?images=aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc3OTkyNzk4NjEtNGRkNDIxODg3ZmIzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjYzNzQ5NjUzMjgtN2Y2MWQ0ZGMxOGM1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2Mjk2NTQyOTcyOTktYzg1MDYyMjFjYTk3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA,aHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTUwNjY5MzEtNDM2NWQxNGJhYjhjP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NjAwJnE9ODA)


### Widgets

Widgets are small embeddable SVG cards for READMEs and profile pages. You can create:

- Info badges like `Label: Value`
- Download badges
- Richer card-style widgets with title, subtitle, description, colors, icon, size, and alignment

They have lots of usecases such as linking your website:


[![Try it out now](https://better-markdown-theta.vercel.app/api/widget?type=card&title=Try+it+out+now&width=200&height=50&radius=10&borderWidth=1&borderColor=%23121212&align=center&bg=24292F&fg=%23ffffff)](https://better-markdown-theta.vercel.app/)


They could be used to download files:

[![Download](https://better-markdown-theta.vercel.app/api/widget?type=card&title=Download&width=175&height=50&radius=10&borderWidth=1&borderColor=%231f2937&align=left&icon=download&iconAlign=right&iconSize=25&bg=%235ff778&fg=%23ffffff)](https://github.com/Cyborg-Taco/congenial-octo-enigma/raw/refs/heads/main/pranks/KARLSONVIBE/video.mp4)

And even pranking people:

[![Click Me](https://better-markdown-theta.vercel.app/api/widget?type=card&title=Click+Me&subtitle=Trust+Me+Bro&width=200&height=50&radius=10&borderWidth=1&borderColor=%231f2937&align=center&bg=%23ff0000&fg=%23ffffff)](https://youtu.be/dQw4w9WgXcQ?si=wNxTpsWlo-jeol23)

## Main Routes

- `/` - Dashboard with links to the available tools
- `/betterimages` - Image gallery generator
- `/widgets` - Widget generator
- `/gallery` - Rendered gallery viewer for generated image sets
- `/api/gallery` - SVG gallery renderer
- `/api/widget` - SVG widget renderer

## Getting Started
To use it simply head on over to https://better-markdown-theta.vercel.app/ and sart using the genarators or you can use these buttons 

[![Better Images](https://better-markdown-theta.vercel.app/api/widget?type=card&title=Better+Images&width=200&height=50&radius=10&borderWidth=1&borderColor=%231f2937&align=center&bg=%23f7765f&fg=%23ffffff)](https://better-markdown-theta.vercel.app/betterimages)[![Widget Generator](https://better-markdown-theta.vercel.app/api/widget?type=card&title=Widget+Generator&width=200&height=50&radius=10&borderWidth=1&borderColor=%231f2937&align=center&bg=%235f92f7&fg=%23ffffff)](https://better-markdown-theta.vercel.app/widgets)


## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Jimp for image processing
- Lucide icons
