#ffmpeg -ss 30 -t 3 -i $1 -vf "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 $1.gif
#ffmpeg  -i $1  $1.webm
ffmpeg -ss 00:00:00 -i $1 -t 00:00:40  -r 10 $1.gif
