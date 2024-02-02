local function lsp_on_attach(client, bufnr)
    local opts = { buffer = bufnr }
    vim.keymap.set('n', '<leader>cD', vim.lsp.buf.declaration, opts)
    vim.keymap.set('n', '<leader>cd', vim.lsp.buf.definition, opts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, opts)
    vim.keymap.set('n', '<leader>ci', vim.lsp.buf.implementation, opts)
    vim.keymap.set('n', '<leader>ch', vim.lsp.buf.signature_help, opts)
    vim.keymap.set('n', '<leader>ct', vim.lsp.buf.type_definition, opts)
    vim.keymap.set('n', '<leader>crn', vim.lsp.buf.rename, opts)
    vim.keymap.set({'n', 'v'}, '<leader>ca', vim.lsp.buf.code_action, opts)
    vim.keymap.set('n', '<leader>crf', vim.lsp.buf.references, opts)
    vim.keymap.set('n', '<leader>f', function ()
        vim.lsp.buf.format { async = true }
    end, opts)
end

return {
    "neovim/nvim-lspconfig",
    dependencies = {
        "williamboman/mason.nvim",
        "williamboman/mason-lspconfig.nvim",
        {
            "mrcjkb/rustaceanvim",
            version = "^4",
            ft = { "rust" },
        },
        "folke/neodev.nvim",
        "lvimuser/lsp-inlayhints.nvim",
    },

    config = function()
        require("mason").setup()
        require("mason-lspconfig").setup({
            ensure_installed = {
                "lua_ls",
                -- "rust_analyzer", uses rustup version
                "clangd",
            },
        })
        require("lsp-inlayhints").setup()
        local capabilities = require("cmp_nvim_lsp").default_capabilities()

        local lspconfig = require("lspconfig")
        lspconfig.lua_ls.setup {
            capabilities = capabilities,
            on_attach = function(client, bufnr)
                lsp_on_attach(client, bufnr)
            end,
            settings = {
                Lua = {
                    diagnostics = {
                        globals = { "vim" }
                    }
                }
            }
        }
        lspconfig.clangd.setup {
            capabilities = capabilities,
            on_attach = function(client, bufnr)
                lsp_on_attach(client, bufnr)
            end,
        }

        vim.g.rustaceanvim = {
            tools = {
                autoSetHints = true,
                inlay_hints = {
                    other_hints_prefix = "=> "
                }
            },

            server = {
                on_attach = function(client, bufnr)
                    lsp_on_attach(client, bufnr)

                    require("lsp-inlayhints").on_attach(client, bufnr)
                end,
                settings = {
                    ['rust_analyzer'] = {
                        capabilities = capabilities;
                        cargo = {
                            allFeatures = true,
                            loadOutDirsFromCheck = true,
                            runBuildScripts = true,
                        }
                    }
                }
            },
        }
    end
}
