return {
    "alexghergh/nvim-tmux-navigation",
    event = "VeryLazy",
    keys = {
        { "<C-h>", "<Cmd>NvimTmuxNavigateLeft<CR>", silent = true },
        { "<C-j>", "<Cmd>NvimTmuxNavigateDown<CR>", silent = true },
        { "<C-k>", "<Cmd>NvimTmuxNavigateUp<CR>", silent = true },
        { "<C-l>", "<Cmd>NvimTmuxNavigateRight<CR>", silent = true },
        { "<C-\\>", "<Cmd>NvimTmuxNavigateLastActive<CR>", silent = true },
        { "<C-tab>", "<Cmd>NvimTmuxNavigateNavigateNext<CR>", silent = true },
    },
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
                next = "<C-tab>",
            },
        })
    end,
}
