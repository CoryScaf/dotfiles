return {
    "stevearc/oil.nvim",
    config = function()
        require("oil").setup({
            default_file_explorer = true,
            columns = {
                "icon",
            },

            view_options = {
                show_hidden = true,
            }
        })

        vim.keymap.set("n", "<leader>e", "<CMD>Oil<CR>", {})
    end,
    dependencies = { "nvim-tree/nvim-web-devicons" },
}
