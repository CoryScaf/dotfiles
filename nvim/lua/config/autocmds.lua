vim.api.nvim_create_autocmd("TextYankPost", {
    desc = "Highlight when yanking text",
    group = vim.api.nvim_create_augroup("highlight-yank", { clear = true }),
    callback = function()
        vim.highlight.on_yank()
    end,
})

vim.api.nvim_create_autocmd("BufEnter", {
    callback = function()
        vim.opt.formatoptions:remove { "c", "o" }
    end,
    group = vim.api.nvim_create_augroup("general", { clear = true }),
    desc = "Disable New Line Comment",
})
