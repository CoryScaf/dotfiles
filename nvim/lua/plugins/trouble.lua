return {
    "folke/trouble.nvim",
    keys = {
        { "<leader>tt", function() require("trouble").toggle() end, desc = "trouble toggle" },
        { "<leader>tn", function()
            require("trouble").next({ skip_groups = true, jump = true })
        end, desc = "trouble next" },
        { "<leader>tp", function()
            require("trouble").previous({ skip_groups = true, jump = true })
        end, desc = "trouble previous" },
    },
    config = function()
        require("trouble").setup({
            icons = true,
        })
    end,
}
