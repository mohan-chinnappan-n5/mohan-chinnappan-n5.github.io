import pygame
import sys

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 600
SCREEN_HEIGHT = 400
BLOCK_SIZE = 50
GRID_WIDTH = SCREEN_WIDTH // BLOCK_SIZE
GRID_HEIGHT = SCREEN_HEIGHT // BLOCK_SIZE
PLAYER_SIZE = 30
FPS = 60

# Colors
SKY_BLUE = (135, 206, 235)
GRASS_GREEN = (107, 142, 35)
DIRT_BROWN = (139, 69, 19)
PLAYER_ORANGE = (255, 69, 0)
BLACK = (0, 0, 0)

# Set up the display
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("2D Minecraft Game")
clock = pygame.time.Clock()

# Player and game state
player = {'x': BLOCK_SIZE, 'y': SCREEN_HEIGHT - BLOCK_SIZE - PLAYER_SIZE}  # Starting position
blocks = []  # List to store block positions
score = 0
mode = 'place'  # Default mode: place blocks

# Font for score
font = pygame.font.Font(None, 36)

def draw_grid():
    # Draw ground (green) and sky (blue)
    screen.fill(SKY_BLUE)
    pygame.draw.rect(screen, GRASS_GREEN, (0, SCREEN_HEIGHT // 2, SCREEN_WIDTH, SCREEN_HEIGHT // 2))

def draw_player():
    pygame.draw.circle(screen, PLAYER_ORANGE, (int(player['x'] + PLAYER_SIZE // 2), int(player['y'] + PLAYER_SIZE // 2)), PLAYER_SIZE // 2)

def draw_blocks():
    for block in blocks:
        pygame.draw.rect(screen, DIRT_BROWN, (block['x'], block['y'], BLOCK_SIZE, BLOCK_SIZE))

def update_score():
    score_text = font.render(f"Score: {score}", True, BLACK)
    screen.blit(score_text, (10, 10))

def handle_click(pos):
    global score, blocks
    x, y = pos
    grid_x = (x // BLOCK_SIZE) * BLOCK_SIZE
    grid_y = (y // BLOCK_SIZE) * BLOCK_SIZE

    if mode == 'place' and 0 <= grid_x < SCREEN_WIDTH - BLOCK_SIZE and 0 <= grid_y < SCREEN_HEIGHT - BLOCK_SIZE:
        blocks.append({'x': grid_x, 'y': grid_y})
        score += 10
    elif mode == 'remove':
        for block in blocks[:]:  # Create a copy to modify while iterating
            if block['x'] == grid_x and block['y'] == grid_y:
                blocks.remove(block)
                score -= 5
                break

def main():
    global player, mode

    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:  # Left click
                handle_click(event.pos)
            elif event.type == pygame.KEYDOWN:
                step = BLOCK_SIZE
                if event.key == pygame.K_UP and player['y'] < SCREEN_HEIGHT - BLOCK_SIZE - PLAYER_SIZE:
                    player['y'] += step
                elif event.key == pygame.K_DOWN and player['y'] > 0:
                    player['y'] -= step
                elif event.key == pygame.K_LEFT and player['x'] > 0:
                    player['x'] -= step
                elif event.key == pygame.K_RIGHT and player['x'] < SCREEN_WIDTH - PLAYER_SIZE:
                    player['x'] += step
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_1:  # Switch to place mode
                    mode = 'place'
                elif event.key == pygame.K_2:  # Switch to remove mode
                    mode = 'remove'
                elif event.key == pygame.K_r:  # Reset game
                    player = {'x': BLOCK_SIZE, 'y': SCREEN_HEIGHT - BLOCK_SIZE - PLAYER_SIZE}
                    blocks = []
                    score = 0

        # Draw everything
        draw_grid()
        draw_blocks()
        draw_player()
        update_score()

        pygame.display.flip()
        clock.tick(FPS)

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()