local function lsp_on_attach(client, bufnr)
    vim.keymap.set('n', '<leader>cD', vim.lsp.buf.declaration, { buffer = bufnr, desc = "goto declaration" })
    vim.keymap.set('n', '<leader>cd', vim.lsp.buf.definition, { buffer = bufnr, desc = "goto definition" })
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, { buffer = bufnr, desc = "whatever hover is" })
    vim.keymap.set('n', '<leader>ci', vim.lsp.buf.implementation, { buffer = bufnr, desc = "goto implementation" })
    vim.keymap.set('n', '<leader>ch', vim.lsp.buf.signature_help, { buffer = bufnr, desc = "signature help" })
    vim.keymap.set('n', '<leader>ct', vim.lsp.buf.type_definition, { buffer = bufnr, desc = "type definition" })
    vim.keymap.set('n', '<leader>crn', vim.lsp.buf.rename, { buffer = bufnr, desc = "rename variable" })
    vim.keymap.set({'n', 'v'}, '<leader>ca', vim.lsp.buf.code_action, { buffer = bufnr, desc = "code action" })
    vim.keymap.set('n', '<leader>crf', vim.lsp.buf.references, { buffer = bufnr, desc = "references" })
    vim.keymap.set('n', '<leader>cf', function ()
        vim.lsp.buf.format { async = true }
    end, { buffer = bufnr, desc = "format" })

    require("which-key").register({
        ["<leader>c"] = { name = "+code" },
    })
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
