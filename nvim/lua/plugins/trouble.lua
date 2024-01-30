return {
    "folke/trouble.nvim",
    keys = {
        { "<leader>tt", function() require("trouble").toggle() end },
        { "<leader>tn", function() require("trouble").next({ skip_groups = true, jump = true }) end },
        { "<leader>tp", function() require("trouble").previous({ skip_groups = true, jump = true }) end },
    },
    config = function()
        require("trouble").setup({
            icons = true,
        })
    end,
}
