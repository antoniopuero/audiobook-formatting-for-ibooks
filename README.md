# audiobook-formatting-for-ibooks
Node cli tool, which takes the audiobook files and applies track number &amp; album name so the files are groupped correctly by iBooks

# Important
Don't run the script immediately on your only copy of files! This script is changing files in place, so be sure to test it out on smaller bunch first - you would want to copy those into a separate folder and try it out.

# Usage
## Dependencies
node v^14
ffmetadata module relies on http://www.ffmpeg.org/ so be sure to install it first

## How to run
1. `npm i -g audiobook-formatting`
2.  run `audiobook-formatting -i <path>`, where path is relative path from current folder to the audiobook root folder
3. if after step above the audiobook is still imported into iBooks as a bucnch of different audiobooks - try to use `-a <custom_album_name>` option. This will rename the album in each media file and after that iBooks will treat them as 1 audiobook.

