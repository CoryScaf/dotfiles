return {
  "alexghergh/nvim-tmux-navigation",
  event = "VeryLazy",
  config = function()
    local nvim_tmux_nav = require("nvim-tmux-navigation")
    nvim_tmux_nav.setup({
      disable_when_zoomed = true,
      keybinds = {
        left = "<C-h>",
        down = "<C-j>",
        up = "<C-k>",
        right = "<C-l>",
        last_active = "<C-\\>",
        next = "<C-space>",
      },
    })
  end,
}
