return {
    "akinsho/bufferline.nvim",
    version = "*",
    dependencies = {
        "nvim-tree/nvim-web-devicons"
    },
    config = function()
        local bufferline = require('bufferline')
        bufferline.setup ({
            options = {
                hover = {
                    enabled = true,
                    delay = 200,
                    reveal = {'close'},
                },

                diagnostics = "nvim_lsp",
                always_show_bufferline = false,

                --- count is an integer representing total count of errors
                --- level is a string "error" | "warning"
                --- this should return a string
                --- Don't get too fancy as this function will be executed a lot
                diagnostics_indicator = function(count, level)
                    local icon = level:match("error") and " " or ""
                    return " " .. icon .. count
                end
            },
        })

        vim.keymap.set("n", "<leader>bp", ":BufferLinePick<CR>", { silent = true })
        vim.keymap.set("n", "<leader>bd", ":BufferLinePickClose<CR>", { silent = true })
        vim.keymap.set("n", "<S-h>", ":BufferLineCyclePrev<CR>", { silent = true })
        vim.keymap.set("n", "<S-l>", ":BufferLineCycleNext<CR>", { silent = true })
    end,
}
