return {
    "folke/which-key.nvim",
    event = "VeryLazy",
    opts = {
        plugins = { spelling = true },
        defaults = {
            mode = { "n", "v" },
            ["<leader>c"] = { name = "+code" },
            ["<leader>f"] = { name = "+find" },
            ["<leader>fg"] = { name = "+git" },
            ["<leader>t"] = { name = "+trouble" },
            ["<leader>h"] = { name = "+harpoon" },
        }
    },
    config = function(_, opts)
        local wk = require("which-key")
        wk.setup(opts)
        wk.register(opts.defaults)
    end,
}
